import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';


@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.state = {
      cards: props.scenes,
    };
  }

  getScenes(){
    return this.state.cards.map(c => c.id);
  }

  addScene(c) {
    const cards = this.state.cards.slice();
    cards.push(c);
    this.setState({ cards });
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }));
  }

  removeCard(id){
    console.log("Remove #" + id); 

    const newCards = [];
    for (let c of this.state.cards){
      if (c.id == id)
        continue;

      newCards.push(c);
    }

    this.setState({ cards: newCards });
  }

  render() {
    const { cards } = this.state;

    return (
      <div>
        {
          (!cards || cards.length == 0) ? <p>No scenes</p> : ""
        }
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            data={card}
            moveCard={this.moveCard}
            removeCard={this.removeCard}
          />
        ))}
      </div>
    );
  }
}


const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget('card', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('card', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class Card extends Component {
  render() {
    const { data, index, isDragging, connectDragSource, connectDropTarget, removeCard } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{ ...cardStyle, opacity }}>
        {index+1}) { data.name } ({ data.template })
        <button style={{ float:"right" }} onClick={() => removeCard(data.id)}>X</button>
      </div>,
    ));
  }
}