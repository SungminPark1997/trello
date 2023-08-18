import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import DragabbleCard from "./Components/DragabbleCard";
import Board from "./Components/Board";
const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { source, destination, draggableId } = info;
    if (!destination) return;
    if (source.droppableId == destination?.droppableId) {
      setToDos((allToDos) => {
        const toDosCopy = [...allToDos[source.droppableId]];
        const taskObj = toDosCopy[source.index];
        toDosCopy.splice(source.index, 1);

        toDosCopy.splice(destination?.index, 0, taskObj);
        console.log(toDosCopy);
        return {
          ...allToDos,
          [source.droppableId]: toDosCopy,
        };
      });
    }
    if (source.droppableId !== destination?.droppableId) {
      setToDos((allToDos) => {
        const destinationTodo = [...allToDos[destination?.droppableId]];
        const sourceTodo = [...allToDos[source.droppableId]];

        const taskObj = sourceTodo[source.index];
        sourceTodo.splice(source.index, 1);
        destinationTodo.splice(destination.index, 0, taskObj);

        return {
          ...allToDos,
          [source.droppableId]: sourceTodo,
          [destination.droppableId]: destinationTodo,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
