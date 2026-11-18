const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/create', (req, res) => {
  const { name, bio, skills, link } = req.body;

  const userName = name.trim();
  const skillList = skills.split(',').map(item => item.trim());

  const file = path.join(__dirname, 'profiles.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  const newUser = {
    name: userName,
    bio: bio.trim(),
    skills: skillList,
    link: link.trim()
  };

  data.push(newUser);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${userName} - Profile Card</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="card">
        <img src="${avatar}" alt="avatar" class="avatar">
        <h2>${userName}</h2>
        <p>${newUser.bio}</p>
        <div class="skills">
          ${skillList.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        <a href="${newUser.link}" target="_blank" class="link-btn">View Profile</a>
        <a href="/" class="back">Create another card</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});