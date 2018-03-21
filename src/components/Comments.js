import React from 'react'

export default class Comments extends React.Component {

  render () {
   
    return (  
         <ul style={{"listStyle" : "none", "padding" : "0px"}}>
            {this.props.comments && this.props.comments.map((comment) => {
               return <li key={comment.id}><strong>{this.props.facebookEmail}</strong> : {comment.description}</li>
            }
            )}
          </ul>
    )
  }
}
