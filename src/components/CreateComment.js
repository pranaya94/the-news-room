import React from 'react'
import { gql, graphql } from 'react-apollo'

class CreateComment extends React.Component {

  constructor(props){
    super(props)
    this.state = { description : ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleComment = this.handleComment.bind(this)
  }
 
  handleChange(e){
    this.setState({ description : e.target.value });
  }

  handleComment = async () => {
    // console.log(this.props);
    const { description } = this.state
    const  postId  = this.props.postId
    const authorId = this.props.authorId
    const resp =  await this.props.CreateCommentMutation({variables: { description, postId, authorId }});
    console.log(resp);
    // this.setState({description: description});
    // console.log(this.props.data.updatePost);
    // this.props.history.push('/')
    window.location = "/";
  }


  render () {
  
    return (
    <div style={{"marginTop" : "10px", "marginBottom" : "10px"}}>
      <input style = {{display:"block", width:"100%", borderRadius:"10px", borderStyle:"none", marginBottom:"10px"}} 
      value = {this.state.description}
      placeholder="Enter comment here"  onChange={this.handleChange}/>      
      {this.state.description &&
            <button className='btn btn-success' onClick={this.handleComment}>Post</button>
          }
    </div>
    )
  } 

}

// const LOGGED_IN_USER = gql`
//   query LoggedInUser {
//     loggedInUser {
//       id
//     }
//   }
// `

const CREATE_COMMENT = gql`
  mutation CreateComment ($description : String!, $postId : ID!, $authorId : ID! ) {
    createComment(description: $description, postId: $postId, authorId : $authorId) {
      id
      description 
    }
  }
`

export default graphql(CREATE_COMMENT, {name: 'CreateCommentMutation'})(CreateComment)
