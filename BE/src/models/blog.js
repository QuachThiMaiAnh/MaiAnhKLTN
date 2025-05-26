  import mongoose from "mongoose";
  import paginate from "mongoose-paginate-v2";

  const blogSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      content: {
        type: String, 
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      image: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,  
      versionKey: false, 
    }
  );

  // Plugin phân trang
  blogSchema.plugin(paginate);

  const Blog = mongoose.model("Blog", blogSchema);
  export default Blog;
