import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import logo from './ak.png'

//


//Kirjautumistoiminto

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [validMessage, setMessage] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
//Login handleri  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    }
  }
  
//etusivun login -form kysyy käyttäjän tunnusta
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
          <input
          type="password"
          value={password}
          name="Passwordasdfasdf"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

//Hookki katsoo onko localstoragessa käyttäjä kirjautuneena eli onko token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs( initialBlogs )
    )  
  }, [])


//Blogin lisäys
  const addBlog = (event) => {
    event.preventDefault()
    
    const blogObject = {
      author: author,
      title: title,
      url: url,
    }
    blogService
    .create(blogObject)
      .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog('')
      setMessage('New blog "' + title + '" added by author ' + author)
      setTimeout(() => {
      setMessage(null)
      }, 5000)
    })
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
    console.log("Ollaanko handleBlogissa")
  }

//Blogin formin renderöinti
  const blogForm = () => (
    <form class='blogform' onSubmit={addBlog}>
      
      <div>
        Title:  
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:   
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL:  
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>   
  )

//RETURN
 if (user === null){
    return (
      <div style={{ 
        backgroundImage: `url(${logo})` 
      }}>
        <h2>Blogs App</h2>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    )}
      
    return(

      <div>
        <head>
          <title>Blogs application</title>
        </head>
        <body>
          <nav>
          
            <h1 class="topbar">
              Blogs</h1>
            <div class='bodydiv'>
              <Notification message={validMessage} />
              <p>Logged in as {user.name}  
                <button onClick={ () => {window.localStorage.clear(); setUser(null)} }>
                  logout 
                </button>
                <p>{blogForm()}
                  {blogs.map(blog =>
                  <Blog key={blog.id} blog={blog}/>
                  )}
                </p>
              </p>
            </div>
          </nav>

        </body>
      </div>
    )
  }


export default App