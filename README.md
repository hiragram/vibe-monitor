# Vibe Monitor

An Electron application for real-time monitoring of GitHub repository activity.

## Features

- **Real-time Monitoring**: Auto-updates for Pull Requests, Workflow Runs, and Runners
- **Polling Control**: Adjustable update intervals with pause capability
- **Rate Limit Friendly**: Optimized API requests to respect GitHub API rate limits
- **Dark Mode**: Toggle between light and dark themes
- **Desktop App**: Runs as a native Electron application

## Setup

### Requirements

- Node.js 18 or higher
- npm or yarn
- GitHub Personal Access Token

### Installation

```bash
# Install dependencies
npm install
```

### Getting a GitHub Personal Access Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Grant the following scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
3. Generate and copy the token

## Usage

### Development Mode (Electron App)

```bash
npm run electron:dev
```

This command will:
- Start the Next.js development server (localhost:3000)
- Launch the Electron app

### Web Browser Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build (Electron App)

```bash
# Build for macOS
npm run electron:build:mac

# Or generic build
npm run electron:build
```

The built app will be generated in the `dist/` directory.

## Configuration

When you launch the app, you'll be prompted to enter:

1. **Repository Owner**: GitHub username or organization name
2. **Repository Name**: Name of the repository to monitor
3. **GitHub Token**: Your Personal Access Token

## Features

### Polling Control

Change update intervals from the dropdown in the top right:
- **Disabled**: Stop polling (manual updates only)
- **10s**: Update every 10 seconds
- **30s**: Update every 30 seconds (default)
- **1m**: Update every minute

### Error Handling

- Polling automatically stops when GitHub API returns an error
- Error messages show details about rate limits and other issues
- Resume polling by selecting an interval from the dropdown

### API Rate Limit

GitHub API rate limits:
- Personal Access Token: **5,000 requests/hour**

This app uses approximately 12-15 requests per poll:
- 30 second interval: ~1,800 requests/hour (36% usage)
- 10 second interval: ~5,400 requests/hour (**may exceed rate limit**)

Recommended: **30 seconds or longer intervals**

## Tech Stack

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Electron**: Desktop application
- **GitHub REST API**: Data fetching

## Project Structure

```
vibe-monitor/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # GitHub API client
├── types/                  # TypeScript type definitions
├── electron/               # Electron main process
│   └── main.js
└── public/                 # Static files
```

## Troubleshooting

### Rate Limit Error

Error message: `Failed to fetch data (403)`

**Solutions**:
1. Increase polling interval (e.g., 1 minute)
2. Temporarily disable polling
3. Wait up to 1 hour for rate limit to reset

### Electron App Won't Start

**Solutions**:
1. Verify Next.js server is running
2. Check that port 3000 is available
3. Re-run `npm run electron:dev`

### No Data Displayed

**Solutions**:
1. Verify GitHub Token is correct
2. Ensure token has required scopes (`repo`, `workflow`)
3. Check repository owner and name are correct

## License

MIT

## Contributing

Issues and Pull Requests are welcome!
