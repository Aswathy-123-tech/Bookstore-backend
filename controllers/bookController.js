const books = require("../model/bookModel");
// import stripe
const stripe = require("stripe")(process.env.stripeKey)

// add book
exports.addBookController = async (req, res) => {
    console.log("inside add book controller");



    const { title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body

    uploadImg = []
    req.files.map((item => uploadImg.push(item.filename)))
    console.log(uploadImg);

    const email = req.payload
    console.log(email);



    try {
        const existingBook = await books.findOne({ title, userEmail: email })

        if (existingBook) {
            res.status(401).json("you have already added this book!!")
        } else {
            console.log("inside....");

            const newBook = new books({
                title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImg, userEmail: email
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


// to get home books
exports.getHomeBookController = async (req, res) => {

    try {

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (err) {
        res.status(500).json(err)

    }


}

exports.getAllBookController = async (req, res) => {
    console.log(req.query);

    const searchkey = req.query.search
    const email = req.payload
    try {
        const query = {
            title: {
                $regex: searchkey, $options: 'i'
            },
            userEmail: { $ne: email }
        }
        const allBook = await books.find(query)
        res.status(200).json(allBook)
    } catch (err) {
        res.status(500).json(err)

    }
}

// to get a particular book in view page
exports.getABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const aBook = await books.findOne({ _id: id })
        res.status(200).json(aBook)
    } catch (err) {
        res.status(500).json(err)

    }
}

exports.deleteBookController = async (req, res) => {
    const { id } = req.params
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json("deleted")

    } catch (err) {
        res.status(500).json(err)

    }
}
// ...............ADMIN............................
exports.getAllAdminBookController = async (req, res) => {
    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    } catch (err) {
        res.status(500).json(err)

    }
}

exports.approveBookController = async (req, res) => {
    const { _id, title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, brought, status, uploadImg, userEmail } = req.body

    console.log(_id, title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, brought, status, uploadImg, userEmail);


    try {
        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noOfPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, brought, status: 'approved', uploadImg, userEmail }, { new: true })
        // await existingbook save()

        res.status(200).json(existingBook)

    } catch (err) {
        res.status(500).json(err)

    }
}

exports.getPurchaseController = async (req, res) => {
    const email = req.payload;
    try {
        const purchaseBooks = await books.find({ brought: email });
        res.status(200).json(purchaseBooks)
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getSoldHistoryController = async (req, res) => {
    const email = req.payload;

    try {
        const AllBooks = await books.find({ userEmail: email });
        res.status(200).json(AllBooks);
    } catch (err) {
        res.status(500).json(err);
    }
};

// make payment    ....

exports.makePaymentController = async (req, res) => {
    const { bookDetails } = req.body
    const brought = req.payload
    try {
        const bookUpdate = await books.findByIdAndUpdate({ _id: bookDetails._id }, {
            title: bookDetails.title,
            author: bookDetails.author,
            noOfPages: bookDetails.noOfPages,
            imageUrl: bookDetails.imageUrl,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract.slice(0,20),
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            uploadImg: bookDetails.uploadImg,
            status: "sold",
            userEmail: bookDetails.userEmail,
            brought

        }, { new: true })

        const line_item = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imageUrl],
                    metadata: {
                        title: bookDetails.title,
                        author: bookDetails.author,
                        noOfPages: `${ bookDetails.noOfPages}`,
                        imageUrl: bookDetails.imageUrl,
                        price: `${bookDetails.price}`,
                        dprice:`${bookDetails.dprice}`,
                        abstract: bookDetails.abstract,
                        publisher: bookDetails.publisher,
                        language: bookDetails.language,
                        isbn: `${ bookDetails.isbn}`,
                        category: bookDetails.category,
                        // uploadImg: bookDetails.uploadImg,
                        status: "sold",
                        userEmail: bookDetails.userEmail,
                        brought

                    }
                },
                unit_amount:Math.round(bookDetails.dprice*100) //cents
            },
            quantity:1
        }]
        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            // purchased using card
            payment_method_types: ["card"],
            // details of product that is purchased
            line_items: line_item,
            // make payment
            mode: "payment",
            // if payment success-url
            success_url: "http://localhost:5173/payment-success",
            // if failed
            cancel_url: "http://localhost:5173/payment-error"
        });
        console.log(session);
        res.status(200).json({ url:session.url})

    } catch (err) {
        res.status(200).json(err)
    }
}
