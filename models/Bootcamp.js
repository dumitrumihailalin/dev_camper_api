    const mongoose = require('mongoose');
    const slugify = require('slugify');
    const BootcampSchema = new mongoose.Schema({
        name: { 
            type: String,
            required: [true, 'Please add name'],
            unique: true,
            trim: true,
            maxLength: [50, 'Name cannot have more than 50 chars'],
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add description'],
            trim: true,
            maxLength: [500, 'Name cannot have more than 500 chars'],
        },
        website: String,
        phone: {
            type: String,
            maxLength: [20, 'Phone number cannot be longer than 20 chars']
        },
        email: {
            type: String
        },
        address: {
            type: String
        },
        // location: {
        //     type: {
        //         type: String,
        //         enum: ['Point'],
        //         required: true
        //     },
        //     coordinates: {
        //         type: [Number],
        //         required: true,
        //         index: '2dsphere'
        //     },
        //     formattedAddress: String,
        //     street: String,
        //     city: String,
        //     state: String,
        //     zipcode: String,
        //     country: String
        // },
        // careers: {
        //     type: [String],
        //     required: true,
        //     enum: [
        //         'Web Development',
        //         'Mobile  Development',
        //         'UI/UX',
        //         'Data Science',
        //         'Business',
        //         'Other'
        //     ]
        // },
        averageRating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot be more than 10']
        },
        averageCost: Number,
        photo: {
            type: String,
            default: 'no-photo.jpg'
        },
        housing: {
            type: Boolean,
            default: false
        },
        jobAssistance: {
            type: Boolean,
            default: false
        },
        jobGuarantee: {
            type: Boolean,
            default: false
        },
        acceptGi: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }
    }); 

    BootcampSchema.pre('save', function(next){
        this.slug = slugify(this.name, {lower: true})
        next();
    })

    module.exports = mongoose.model("Bootcamp", BootcampSchema);