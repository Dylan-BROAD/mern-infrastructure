import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function NoteEdit() {
  const { id } = useParams();
  const [data, setData] = useState({ text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setData({
      ...data,
      text: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update note: ${errorText}`);
      }

      const newData = await response.json();
      setData(newData);
      console.log("Note updated successfully.");
      navigate("/notes"); 
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={data.text}
          onChange={handleChange}
        />
        <br />
        <button type="submit">SAVE</button>
      </form>
    </div>
  );
}