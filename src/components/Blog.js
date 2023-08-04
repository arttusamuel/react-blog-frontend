const Blog = ({blog}) => (
  <div>
    <h3>Title: {blog.title} </h3>
      <p>Author: {blog.author}</p> 
      <p>URL: {blog.url}</p> 
      <p>Likes: {blog.likes}</p>
  </div>  
)



export default Blog;
