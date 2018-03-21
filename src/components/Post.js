import React from 'react'
import CreateComment from './CreateComment'
import Comments from './Comments'

export default class Post extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      show : false
    }
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse(){
    this.setState({
      show : !this.state.show
    });

    console.log(this.state.show);
  }

  render () {

    return (
      <div style={{"backgroundColor" : "#d3dfff", "padding" : "10px", "margin" : "20px", "borderRadius" : "10px","font-family" : "sans-serif"}}>
          <div className='card'> 
            <div className='card-body'>
            <strong>{this.props.post.author.facebookEmail}&nbsp; {new Date(this.props.post.updatedAt).toDateString()}&nbsp;</strong>
            </div> 
          </div>    
        <div className='card'> 
          <div className='card card-body'>
          {this.props.post.description}&nbsp;
          </div> 
        </div>               
        <div className='card'>
           <div className='card card-body'>
            {this.props.loggedInUser && this.props.loggedInUser.id && this.props.loggedInUser.id !== '' &&  <CreateComment authorId = {this.props.post.author.id} postId = {this.props.post.id}/>}
           </div>
        </div> 
        <div className='card'>
          <div className='card card-body'>
    <button className = 'btn btn-primary' onClick={this.handleCollapse}>{!this.state.show && <span>Show Comments</span>}{this.state.show && <span>Hide Comments</span>}</button>
          {this.state.show && <Comments comments = {this.props.post.comments} facebookEmail = {this.props.post.author.facebookEmail} />}
          </div>
        </div>
      </div>        
    )
  }
}
