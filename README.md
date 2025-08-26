# Host the Word add-in locally (for developpers)

Make sure you have Word installed before proceeding.

1. Clone this repo.
2. Run `npm install`
3. Run `npm start`
4. If this is the first time you launch the add-in on your machine, you will be prompted to allow the creation of Microsoft Office dev certificates on this computer. Simply allow and proceed with the instructions on screen.
5. Now Word will automatically open with the Add-in loading in.
6. Important: To make requests to backend through the local instance of the Word Add-in (Document search, Zotero etc.) you will need the proxy server running on your machine. Find the instructions [here](https://github.com/science-editor/word-add-in-proxy).

### Troubleshoot

1. If you see the message "Sorry we could not load your Add-in." or similar one in your taskpane, restart the dev server with:

   → `npm restart`

2. If Word doesn't launch at all, go to your browser and enter https://localhost:7000/taskpane.html. If the Add-in appears here, reinstall Word and try again.

### Production Server

1. To create a production build, use `npm run build`. Generally, you never have to do this manually, as this is done in the Dockerfile, which is executed by the Github Actions in the orchestration repo.


# Sideload into office on the web (for testers)

1. Download the [manifest.prod.xml](https://github.com/science-editor/word-add-in/blob/main/manifest.prod.xml)

2. Open [Office on the web](https://m365.cloud.microsoft/). Open a document in Word

3. Navigate to "Home" > "..." > "Add-ins" > "Advanced..."

4. In the Office Add-ins dialog, select Upload My Add-in

5. Browse to the add-in manifest file you downloaded in step 1, and then select "Upload"

![img.png](assets/add-in-upload-window.png)

6. Wait for a couple of moments until the add-in has finished loading