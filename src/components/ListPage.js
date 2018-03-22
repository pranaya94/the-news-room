import React from 'react'
import Post from '../components/Post'
import { gql, graphql } from 'react-apollo'

class ListPage extends React.Component {

  render () {
    console.log("render of listpage called");
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
    console.log(this.props.data)
    return (              
      <div style={{"align" : "center","maxWidth" : "50%","margin" : "auto"}}>        
          {this.props.data.allPosts.map(post =>
            <Post key={post.id} post={post} loggedInUser = {this.props.loggedInUser}/>
          )}
      </div>
    )
  }
}


const ALL_POSTS = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id      
      description
      updatedAt
      author {
        facebookEmail
        id
      }
      comments {
        description
        id
      }
    }
  }
`

export default graphql(ALL_POSTS)(ListPage)
