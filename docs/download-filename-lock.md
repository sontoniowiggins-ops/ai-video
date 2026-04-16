# Download Filename Lock

```yaml
project_name:
  old: "ai-video"
  new: "elder-wiggins-return-of-judah-mastercut"

render_outputs:
  master_final:
    command: "npm run build:master"
    output_file: "out/ELDER_WIGGINS_RETURN_OF_JUDAH_MASTER_FINAL.mp4"

  youtube:
    command: "npm run build:youtube"
    output_file: "out/ELDER_WIGGINS_RETURN_OF_JUDAH_YOUTUBE_MASTER.mp4"

  tiktok:
    command: "npm run build:tiktok"
    output_file: "out/ELDER_WIGGINS_RETURN_OF_JUDAH_TIKTOK_MASTER.mp4"

rule:
  - "Do not use generic names like video.mp4, youtube.mp4, tiktok.mp4, or return-of-judah.mp4."
  - "Use the locked output names above so Elder Wiggins can identify the correct CPU download file."
```
