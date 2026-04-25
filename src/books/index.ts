import { BookID } from "./types"

const books = Object.values(BookID).filter(id => id !== BookID.error);

export default books;

