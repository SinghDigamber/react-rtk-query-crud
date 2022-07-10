import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import PostsList from './features/posts/PostsList'

function App() {
  return (
    <div className="container">
      <h2 className="mb-5">React RTK Query CRUD Operations Example</h2>
      <PostsList />
    </div>
  )
}

export default App
