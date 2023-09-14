# Art Portfolio Website

## Table Of Contents

## Project Details

## Installation

### New Project Checklist

When you want to add a new project, follow these steps:

1. If this project is not already in [Inventory](https://docs.google.com/spreadsheets/d/10KQ1D8si8kD-kuloa2qy4XtZ03lnMzTqB7bYyU_997w/edit?usp=sharing), add it (and create a new project ID). Note its project ID, hereafter stored in `my_project_id`. This value should be padded with zeros to three digits, e.g. `021` for the 21st project.
2. Identify a key for this project, hereafter stored in `my_project_key`. This key should be unique across all projects and will be used in the url for the project.. For example, a key might be `ritual-nature`. This key should be all lowercase alphanumeric digits and hyphens, and not beginning or ending with a hyphen.
3. Create a new folder at the top level of this repository with the title `my_project_key` and copy into it an *index.html* from another project folder. Inside this *index.html*, rename the `<title>` attribute the full, proper name of your project, e.g. `Ritual Nature`.
4. Create a new folder *_assets/my_project_id* and place inside of it all assets you'll need for the project page. All of these assets should have the extension *.jpg* and should be optimized for web performance (max dimension < 2000 with medium jpeg quality). All assets should have unique numbered names padded with three zeros, e.g. *000.jpg*, *001.jpg*, *002.jpg*, etc.
5. Copy the file *_json/template.json* to *_json/my_project_id* and fill it in with all project information. You can reference images using their number, e.g. `0`, `1`, `2`, etc.
6. Add a homepage image titled *my_project_id.jpg* in the folder *_assets/home*.
7. Add a listing object to the `projects` array in the json file *_json/home.json* following the form:
   ```json
   {
			"projectID": "my_project_id",
			"title": "My Title\n\\ My subtitle.\nYear",
			"url": "http://bensnell.io/my_project_key"
	 }
   ```
8. Link this new page in *sitemap.xml*.

## Usage

## Troubleshooting

## Roadmap

## License

## Notes