let express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose");

///APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",
                 {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(expressSanitizer());
/*===================================================*/
//BLOG SCHEMA
/*===================================================*/

///MONGOOSE/MODEL/CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
/* Test blog was created!!!
Blog.create({
    title: "Test Blog Post",
    image: "https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/ce2ece60-9b32-11e6-95ab-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg",
    body: "Lorem ipsum dolor amet hoodie listicle offal, cornhole wolf coloring book squid tattooed waistcoat meh echo park viral blog crucifix. Chicharrones tote bag tilde kickstarter. Enamel pin fingerstache gastropub, cloud bread jianbing pok pok church-key gluten-free tbh irony keffiyeh pug. Quinoa tofu umami cold-pressed tilde mumblecore waistcoat copper mug fanny pack snackwave you probably haven't heard of them vexillologist blog. Chia authentic pop-up glossier leggings paleo vinyl plaid tumblr. Banjo vegan pabst, intelligentsia master cleanse glossier gochujang viral aesthetic marfa tote bag subway tile pour-over. Disrupt af semiotics, keffiyeh cred pork belly helvetica chambray vexillologist roof party brunch skateboard hoodie tumblr occupy.",
 });
 */
/*=================================================*/
///RESTful ROUTES
/*=================================================*/
app.get("/", (req,res) => {
    res.redirect("/blogs");
});
///INDEX ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (e, blogs) => {
        if(e) {
            console.log(e);
        } else {
            res.render("index", {blogs: blogs});
        };
    });    
});
///NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (e, newBlog) => {
        if(e) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })  
});
///SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (e, foundBlog) => {
        if (e) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
///EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (e, foundBlog) => {
        if(e) {
            res.redirect("/blogs/:id")
        } else {
            res.render("edit", {blog: foundBlog});
        };
    });    
});
///UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (e, updatedBlog) => {
        if(e){
            res.redirect("/blogs/:id");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});
///DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (e) => {
        if(e) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

















app.listen(3000, () => {
    console.log('server has started');
})