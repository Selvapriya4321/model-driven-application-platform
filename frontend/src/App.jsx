import { useState } from 'react';

const API_URL = 'http://localhost:8080/api/models';
const types = ['Text', 'Number', 'Email', 'Date', 'Checkbox'];

function makeSafeName(value) {
  return value.trim().replace(/[^a-zA-Z0-9_]/g, '');
}

export default function App() {
  const [modelName, setModelName] = useState('Student Registration');
  const [fields, setFields] = useState([
    { id: 1, name: 'studentName', type: 'Text', required: true },
    { id: 2, name: 'email', type: 'Email', required: true }
  ]);
  const [message, setMessage] = useState('');

  function addField() {
    setFields(old => [...old, {
      id: Date.now(), name: '', type: 'Text', required: false
    }]);
    setMessage('');
  }

  function updateField(id, key, value) {
    setFields(old => old.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  }

  function removeField(id) {
    setFields(old => old.filter(field => field.id !== id));
  }

  function validateModel() {
    if (!modelName.trim()) {
      setMessage('Error: Please enter a model name.');
      return false;
    }
    if (fields.length === 0) {
      setMessage('Error: Add at least one field.');
      return false;
    }

    const names = fields.map(field => field.name.trim().toLowerCase());
    for (let i = 0; i < fields.length; i++) {
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fields[i].name.trim())) {
        setMessage(`Error: Field ${i + 1} needs a valid name. Start with a letter; use letters, numbers, or underscore.`);
        return false;
      }
      if (names.indexOf(names[i]) !== i) {
        setMessage(`Error: Duplicate field name "${fields[i].name}".`);
        return false;
      }
    }
    setMessage('Success: Model is valid!');
    return true;
  }

  async function saveModel() {
    if (!validateModel()) return;
    const model = {
      name: modelName.trim(),
      fields: fields.map(({ name, type, required }) => ({
        name: name.trim(), type, required
      }))
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });
      if (!response.ok) throw new Error(await response.text());
      const saved = await response.json();
      setMessage(`Saved successfully! Model ID: ${saved.id}`);
    } catch (error) {
      setMessage(`Could not save. Is Spring Boot running? Details: ${error.message}`);
    }
  }

  function generateHtml() {
    if (!validateModel()) return;

    const inputType = { Text: 'text', Number: 'number', Email: 'email', Date: 'date', Checkbox: 'checkbox' };
    const controls = fields.map(field => {
      const name = makeSafeName(field.name);
      const required = field.required ? ' required' : '';
      if (field.type === 'Checkbox') {
        return `  <label><input type="checkbox" name="${name}"${required}> ${field.name}</label>`;
      }
      return `  <label>${field.name}<input type="${inputType[field.type] || 'text'}" name="${name}"${required}></label>`;
    }).join('\n');

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${modelName.replace(/[<>]/g, '')}</title>
<style>
body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px}
label{display:block;margin:14px 0}
input:not([type=checkbox]){display:block;box-sizing:border-box;width:100%;padding:10px;margin-top:6px}
button{padding:10px 18px;cursor:pointer}
</style>
</head>
<body>
<h1>${modelName.replace(/[<>]/g, '')}</h1>
<form>
${controls}
<button type="submit">Submit</button>
</form>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${makeSafeName(modelName) || 'generated-form'}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Generated HTML form downloaded.');
  }

  async function loadModels() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('API request failed');
      const models = await response.json();
      setMessage(`Backend connected. Saved models: ${models.length}`);
    } catch {
      setMessage('Cannot reach backend. Start Spring Boot at http://localhost:8080.');
    }
  }

  return (
    <main className="page">
      <header>
        <p className="eyebrow">MODEL-DRIVEN DEVELOPMENT</p>
        <h1>No-Code Model Designer</h1>
        <p>Create a model, validate it, save it, and generate a simple HTML form.</p>
      </header>

      <section className="steps">
        {['1. Model Design', '2. Model Creation', '3. Model Validation',
          '4. Code Generation', '5. Database Integration', '6. Deployment'].map(step =>
          <div className="step" key={step}>{step}</div>
        )}
      </section>

      <section className="panel">
        <h2>1–2. Design and create your model</h2>
        <label className="model-label">
          Model name
          <input value={modelName} onChange={e => setModelName(e.target.value)}
            placeholder="e.g. Student Registration" />
        </label>

        <div className="field-heading">
          <h3>Fields / Attributes</h3>
          <button onClick={addField}>+ Add field</button>
        </div>

        {fields.map((field, index) => (
          <div className="field-row" key={field.id}>
            <span className="field-number">{index + 1}</span>
            <input aria-label="Field name" value={field.name}
              onChange={e => updateField(field.id, 'name', e.target.value)}
              placeholder="e.g. studentName" />
            <select aria-label="Data type" value={field.type}
              onChange={e => updateField(field.id, 'type', e.target.value)}>
              {types.map(type => <option key={type}>{type}</option>)}
            </select>
            <label className="required">
              <input type="checkbox" checked={field.required}
                onChange={e => updateField(field.id, 'required', e.target.checked)} />
              Required
            </label>
            <button className="remove" onClick={() => removeField(field.id)}>Remove</button>
          </div>
        ))}

        <div className="actions">
          <button onClick={validateModel}>3. Validate model</button>
          <button onClick={saveModel}>5. Save to database</button>
          <button onClick={generateHtml}>4. Generate HTML</button>
          <button className="secondary" onClick={loadModels}>Check backend</button>
        </div>
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="panel">
        <h2>Model preview</h2>
        <p><strong>Model:</strong> {modelName || '(not named)'}</p>
        {fields.length === 0 ? <p>No fields added yet.</p> :
          <ul>{fields.map(field =>
            <li key={field.id}>{field.name || '(unnamed field)'} — {field.type}
              {field.required ? ' — Required' : ' — Optional'}</li>
          )}</ul>}
      </section>

      <footer>Beginner prototype • React.js + Spring Boot + MySQL</footer>
    </main>
  );
}