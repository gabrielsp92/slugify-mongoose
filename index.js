const Slug = require('slug')

module.exports = function (schema, options) {
	const field = schema.tree.slug.slug

	schema.pre('validate', function (next) {
		const _id = this['_id']
		const slug = Slug(this[field])
		const c = this.constructor

		const that = this
		this.schema.statics.slugify(c, slug, _id, 0, final_slug => {
			that['slug'] = final_slug
			next()
		})
	})

	schema.pre('update', function (next) {
		const _id = this._conditions['_id']
		const slug = Slug(this._update.$set[field])

		const that = this
		this.model.slugify(false, slug, _id, 0, (final_slug) => {
			that._update.$set['slug'] = final_slug
			next()
		})
	})

	// Unique slug generator, converts `slug` to `slug_1` if `slug` exists
	schema.statics.slugify = function (c, slug, _id, count, cb) {
		// TODO: Check that slug is not bigger than 1000 characters
		const final_slug = count ? `${ slug }_${ (count || '') }` : slug

		const search_slug = item => {
			if (item)
			// Checks if current document has already the current slug
				if (`${ item._id }` === `${ _id }`)
					cb(final_slug)
				else
				return this.slugify(c, slug, _id, (count || 0) + 1, cb)
			else
			cb(final_slug)
		}

		const that = c || this
		that.findOne({ slug: final_slug }).then(search_slug)
	}
}
