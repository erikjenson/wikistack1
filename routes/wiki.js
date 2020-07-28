const router = require('express').Router();
const { Page, User } = require('../models');

const { addPage, editPage, main, wikiPage } = require('../views');

router.get('/', async (req, res, next) => {
  try {
    const page = await Page.findAll({
      attributes: ['id', 'title', 'slug'],
    });
    res.send(main(page));
  } catch (error) {
    next(error);
  }
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.post('/', async (req, res, next) => {
  try {
    const author = await User.findOrCreate({
      where: { name: req.body.name, email: req.body.email },
    });

    const authorId = author[0].id;

    const page = new Page({
      title: req.body.title,
      content: req.body.content,
      authorId: authorId,
    });

    await page.save();
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });
    const author = await page.getAuthor();
    res.send(wikiPage(page, author));
  } catch (error) {
    next(error);
  }
});

router.get('/:slug/edit', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });
    const author = await page.getAuthor();
    res.send(editPage(page, author));
  } catch (error) {
    next(error);
  }
});

router.post('/:slug', async (req, res, next) => {
  try {
    const [numRowsChanged, newRows] = await Page.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: { id: req.body.id },
      }
    );

    res.redirect('/wiki/');
  } catch (error) {
    next(error);
  }
});

router.get('/:slug/delete', async (req, res, next) => {
  try {
    const numAffectedRows = await Page.destroy({
      where: {
        slug: req.params.slug,
      },
    });
    res.redirect('/wiki');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
