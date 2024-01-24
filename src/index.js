import { createRoot } from 'react-dom/client';
import MyEditor from './Components/Editor';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<MyEditor />);

