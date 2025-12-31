import { useBooks } from '../context/BooksContext';
import { useToast } from '../context/ToastContext';

export default function BookList({ books }) {
  const { deleteBook, updateBook } = useBooks();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempPart, setTempPart] = useState('');

  return (
    <table width="100%" border="1" cellPadding="6">
      <thead>
        <tr>
          <th>S.No</th>
          <th>ID</th>
          <th>Title</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {books.map((b, index) => (
          <tr key={b.id}>
            <td>{index + 1}</td>
            <td>{b.id}</td>

            {/* TITLE */}
            <td>
              {editingId === b.id ? (
                <>
                  <input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    style={{ marginRight: 6 }}
                  />

                  <input
                    value={tempPart}
                    onChange={(e) => setTempPart(e.target.value)}
                    placeholder="Part I / Part II"
                    style={{ width: 90 }}
                  />
                </>
              ) : (
                <>
                  {b.title}
                  {b.part ? ` — Part ${b.part}` : ''}
                </>
              )}
            </td>

            {/* ACTION BUTTONS */}
            <td>
              {editingId === b.id ? (
                <>
                  <button
                    onClick={() => {
                      const result = updateBook(b.id, tempTitle, tempPart);

                      if (!result.ok) {
                        showToast(result.msg, 'error');
                        return;
                      }

                      showToast('Updated successfully', 'success');
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>

                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(b.id);
                      setTempTitle(b.title);
                      setTempPart(b.part || '');
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        'Are you sure?\n\nThis will permanently delete this book from the list.'
                      );

                      if (!confirmed) return;

                      const result = deleteBook(b.id);

                      if (!result?.ok) {
                        showToast(result.msg, 'error');
                        return;
                      }

                      showToast('Deleted successfully', 'warning');
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

