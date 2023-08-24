import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
const Wrapper = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
interface Iprop {
  count: number;
}
const Boards = styled.div<Iprop>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(props) => props.count}, 1fr);
`;
const Form = styled.form`
  width: 10%;
  input {
    width: 100%;
  }
`;
interface IForm {
  board: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
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
  const onCreateBoard = ({ board }: IForm) => {
    setToDos((allTodos) => {
      const newBoard = board;
      return {
        ...allTodos,
        [newBoard]: [],
      };
    });
    setValue("board", "");
  };
  console.log(Object.keys(toDos).length);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Form onSubmit={handleSubmit(onCreateBoard)}>
        <input
          {...register("board", { required: true })}
          type="text"
          placeholder={`Add task on `}
        />
      </Form>
      <Wrapper>
        <Boards count={Object.keys(toDos).length}>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
