import React from 'react'
import { withRouter } from 'react-router'
import { gql, graphql, compose } from 'react-apollo'

class CreatePost extends React.Component {

  constructor(props){
    super(props);
    this.handlePost = this.handlePost.bind(this);
  }
  state = {
    description: '',
  }

  render () {
    console.log("create post props all" , this.props)
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.description}
            placeholder='Description'
            onChange={(e) => this.setState({description: e.target.value})}
          />         
         
          {this.state.description &&
            <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost}>Post</button>
          }
        </div>
      </div>
    )
  }

  handlePost = async () => {
    const loggedInUser = this.props.data.loggedInUser

    // redirect if no user is logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts')
      this.props.history.push('/')
      return
    }

    const { description } = this.state
    const authorId = loggedInUser.id

    await this.props.CreatePostMutation({variables: { description, authorId }})
    this.props.history.push('/')
    return;
  }
}

const LOGGED_IN_USER = gql`
  query LoggedInUser {
    loggedInUser {
      id
    }
  }
`

const CREATE_POST = gql`
  mutation CreatePost ($description: String!, $authorId: ID!) {
    createPost(description: $description, authorId: $authorId) {
      id
    }
  }
`

export default compose(
  graphql(LOGGED_IN_USER, { options: {fetchPolicy: 'network-only'}}),
  graphql(CREATE_POST, {name: 'CreatePostMutation'}),
)(withRouter(CreatePost))
