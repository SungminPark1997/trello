import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";
const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const DeleteCard = styled.button`
  height: 100%;
  margin-left: auto;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

const DragabbleCard = ({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDragabbleCardProps) => {
  const [toDo, setTodo] = useRecoilState(toDoState);
  const onDelete = () => {
    setTodo((allTodos) => {
      const items = [...allTodos[boardId]];

      const deleteIndex = items.findIndex((i) => i.text === toDoText);
      console.log(deleteIndex);
      console.log(typeof items);
      items.splice(deleteIndex, 1);

      return {
        ...allTodos,
        [boardId]: items,
      };
    });
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
          <DeleteCard onClick={onDelete}>x</DeleteCard>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DragabbleCard);
