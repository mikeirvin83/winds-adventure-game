# Deployment Guide - GitHub Pages

## Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. Go to GitHub.com and create a new repository
2. Name it: winds-adventure-game
3. Make it Public (required for free GitHub Pages)
4. Do NOT initialize with README
5. Click Create Repository

### Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /home/ubuntu/winds_adventure_game

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/winds-adventure-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository Settings
2. Click Pages in the left sidebar
3. Under Source select:
   - Branch: gh-pages
   - Folder: / (root)
4. Click Save

### Step 4: Deploy

The GitHub Actions workflow will automatically deploy when you push.

Or manually trigger it:
1. Go to Actions tab
2. Click Deploy to GitHub Pages
3. Click Run workflow
4. Select main branch
5. Click Run workflow

### Step 5: Access Your Game

After 2-5 minutes, your game will be live at:

```
https://YOUR_USERNAME.github.io/winds-adventure-game/
```

## Troubleshooting

### Workflow Fails
- Check Actions tab for error details
- Ensure Node.js version matches (18+)
- Check workflow permissions in Settings > Actions

### 404 Error
- Wait 5-10 minutes after first deployment
- Verify gh-pages branch exists
- Clear browser cache

### Backend Connection Issues
- Verify backend is at: https://windsadventure.abacusai.app
- Check browser console (F12) for errors

## Updates

To update your deployed game:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically redeploy!

## Need Help?

- GitHub Pages Docs: https://docs.github.com/en/pages
- GitHub Actions Docs: https://docs.github.com/en/actions

Your game will be live in minutes!
