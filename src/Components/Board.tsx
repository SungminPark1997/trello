import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";
const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;

  display: flex;
  margin: 10px;
  flex-direction: column;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.div`
  text-align: center;
  flex-grow: 1; /* 중앙으로 확장 */
`;

const DeleteBoard = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IForm {
  toDo: string;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;
function Board({ toDos, boardId }: IBoardProps) {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setTodo = useSetRecoilState(toDoState);

  const [isClick, setClick] = useState(false);

  const onValid = ({ toDo }: IForm) => {
    console.log(toDo);
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setTodo((allTodos) => {
      return {
        ...allTodos,
        [boardId]: [...allTodos[boardId], newTodo],
      };
    });
    setValue("toDo", "");
  };

  const onDelete = () => {
    setTodo((allTodos) => {
      const newTodos = { ...allTodos };

      delete newTodos[boardId];
      return {
        ...newTodos,
      };
    });
  };
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{boardId}</Title>
        <DeleteBoard onClick={onDelete}>X</DeleteBoard>
      </TitleWrapper>

      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
