const { Router } = require('express')
const pool = require('../config/db')
const router = Router()

router.get("/", async (req, res) => {
    try {
        const employers = await pool.query('SELECT * FROM employer')
        res.status(200).json(employers.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// add employer
router.post('/add', async (req, res) => {
    try {
        const { name, salary, dagree, job_id } = req.body
        const newEmployer = await pool.query(`
      INSERT INTO employer (name, dagree, salary, job_id) VALUES ($1, $2, $3, $4) RETURNING *
      `, [name, dagree, salary, job_id])
        res.status(201).json(newEmployer.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// update employer
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { name, salary, dagree, job_id } = req.body
        const oldEmployerResult = await pool.query('SELECT * FROM employer WHERE id = $1', [id])
        // if (oldEmployerResult.rows.length === 0) {
        //     return res.status(404).json({ message: 'Employer not found' })
        // }
        const oldEmployer = oldEmployerResult.rows[0]
        const updateEmployer = await pool.query(`
            UPDATE employer 
            SET name = $1, dagree = $2, salary = $3, job_id = $4 
            WHERE id = $5 RETURNING *
        `, [
            name ? name : oldEmployer.name,    // Use the new value or fallback to the old one
            dagree ? dagree : oldEmployer.dagree,
            salary ? salary : oldEmployer.salary,
            job_id ? job_id : oldEmployer.job_id,
            id
        ])
        res.status(201).json(updateEmployer.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// delete employer
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM employer WHERE id = $1', [req.params.id])
        res.status(200).json({ message: "Employer deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// get employer by id
router.get('/:id', async (req, res) => {
    try {
        const employer = await pool.query(`
      SELECT employer.name, employer.salary, job.title FROM employer 
      LEFT JOIN job ON job.id = employer.job_id 
      WHERE employer.id = $1
      `, [req.params.id])
        res.status(200).json(employer.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
