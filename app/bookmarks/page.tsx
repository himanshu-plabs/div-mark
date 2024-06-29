'use client'
import { useState, ChangeEvent, FormEvent } from 'react';
import { GenerateTags } from '../Tags/actions';

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const data = await GenerateTags(url);
      console.log(data);
      setTags(data.tags);
      
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div>
      <h1>Generate Tags for a Webpage</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter webpage URL"
        />
        <button type="submit">Generate Tags</button>
      </form>
      {tags.length > 0 && (
        <div>
          <h2>Generated Tags:</h2>
          <ul>
            {tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
