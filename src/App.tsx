import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
interface Iprop {
  count: number;
}
interface IForm {
  board: string;
}
const Wrapper = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CreateBoard = styled.div`
  color: white;
  cursor: pointer;
`;
const Boards = styled.div<Iprop>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(props) => props.count}, 1fr);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 10%;
  margin: auto;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 0.2vw;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
`;
const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  font-size: 1vw;

  &:hover {
    background-color: #45a049;
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [isClick, setClick] = useState(false);
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
      <FontAwesomeIcon icon={faHouse} />
      <CreateBoard
        onClick={() => {
          setClick((prev) => !prev);
        }}
      >
        Create Board
      </CreateBoard>

      {isClick ? (
        <Form onSubmit={handleSubmit(onCreateBoard)}>
          <Input
            {...register("board", { required: true })}
            type="text"
            placeholder={`Add task on `}
          />
          <Button>add List</Button>
        </Form>
      ) : null}

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
