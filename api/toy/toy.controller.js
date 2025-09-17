import { toyService } from './toy.service.js'

export async function getToys(req, res) {
  console.log('GET /api/toy called with query:', req.query)
  try {
    const filterBy = {
      name: req.query.name || '',
      inStock:
        req.query.inStock === 'true' ? true :
          req.query.inStock === 'false' ? false : undefined,
      labels: req.query.labels ? req.query.labels.split(',') : [],
      minPrice: req.query.minPrice ? +req.query.minPrice : undefined,
    }
    console.log('FilterBy:', filterBy)

    const toys = await toyService.query(filterBy)
    console.log('Found toys:', toys)
    res.json(toys)

  } catch (err) {
    console.error('Error in GET /api/toy:', err)  // log full error
    res.status(500).send({ err: 'Failed to get toys', details: err.message })
  }

}

export async function getToyById(req, res) {
  try {
    const toy = await toyService.getById(req.params.id)
    res.json(toy)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

export async function addToy(req, res) {
  try {
    const toy = await toyService.add(req.body)
    res.json(toy)
  } catch (err) {
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const toy = { ...req.body, _id: req.params.id }
    const updated = await toyService.update(toy)
    res.json(updated)
  } catch (err) {
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const deletedCount = await toyService.remove(req.params.id)
    res.send(`${deletedCount} toys removed`)
  } catch (err) {
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

// messages
export async function addToyMsg(req, res) {
  try {
    const msg = { txt: req.body.txt, by: req.body.by || null }
    const savedMsg = await toyService.addToyMsg(req.params.id, msg)
    res.json(savedMsg)
  } catch (err) {
    res.status(500).send({ err: 'Failed to add toy msg' })
  }
}

export async function removeToyMsg(req, res) {
  try {
    const removedId = await toyService.removeToyMsg(req.params.id, req.params.msgId)
    res.send(removedId)
  } catch (err) {
    res.status(500).send({ err: 'Failed to remove toy msg' })
  }
}
