import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface ITodo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: ITodo[];
}

const { persistAtom } = recoilPersist({
  key: "todoState",
  storage: localStorage,
});
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    To_do: [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

// TO_Do[{key:1,text:lksdfleke},{key2,text:ekfjelkfjlekf}]
