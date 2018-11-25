const KoaRouter = require('koa-router');
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');


const router = new KoaRouter();

router.get('reviews-new', '/new', async (ctx) => {
  const bid = await ctx.orm.bid.findById(ctx.params.bid);
  const publication = await ctx.orm.publication.findById(bid.publicationId);
  let receiverUser;
  if (ctx.state.currentUser.id === bid.receiverId) {
    receiverUser = await ctx.orm.user.findById(bid.bidderId);
  } else {
    receiverUser = await ctx.orm.user.findById(bid.receiverId);
  }
  return ctx.render(
    'reviews/new',
    {
      bid,
      publication,
      currentUser: ctx.state.currentUser,
      receiverUser,
      review: ctx.orm.review.build(),
      submitPath: ctx.router.url('reviews-create', bid.publicationId, bid.id),
    },
  );
});

router.post('reviews-create', '/', async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  const bid = await ctx.orm.bid.findById(ctx.params.bid);
  let receiverUser;
  if (ctx.state.currentUser.id === bid.receiverId) {
    receiverUser = await ctx.orm.user.findById(bid.bidderId);
  } else {
    receiverUser = await ctx.orm.user.findById(bid.receiverId);
  }
  try {
    await review.save(ctx.request.body);
    bid.setReview(review);
    ctx.flashMessage.notice = 'Evaluación creada exitosamente';
    receiverUser.update({ reputation: receiverUser.reputation + review.score });
    ctx.redirect(ctx.router.url('users-concreted', ctx.state.currentUser.id));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    const publication = await ctx.orm.publication.findById(bid.publicationId);
    await ctx.render('reviews/new', {
      review,
      errors: getFirstErrors(error),
      bid,
      publication,
      currentUser: ctx.state.currentUser,
      receiverUser,
      submitPath: ctx.router.url('reviews-create', bid.publicationId, bid.id),
    });
  }
});

module.exports = router;
