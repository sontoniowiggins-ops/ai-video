# Return of Judah — Production Lock

```yaml
production_lock:
  approved_by: "Elder Wiggins"
  status: "locked"

voiceover:
  decision: "Use the voiceover style and narration lines created by Elder Wiggins + ChatGPT."
  style: "prophetic documentary"
  tone:
    - "not dry"
    - "cinematic"
    - "authoritative"
    - "warm but serious"
    - "keeps the beat"
  rule:
    - "No dry moments."
    - "Every scene must move, speak, breathe, and transition."
  tts_engine: "OpenAI TTS"
  preferred_voice: "onyx"
  default_speed: "0.80"

images:
  generator: "Leonardo API"
  rule:
    - "Clearly Black people where people appear."
    - "8K cinematic realistic photo style."
    - "No screenshots."
    - "No flat placeholder art."
    - "No cartoon/vector/illustration style."

remotion:
  method: "Build the full structure first."
  asset_rule:
    - "Never rebuild the whole video because of a bad image."
    - "Only replace the image file inside public/images/ using the same scene filename."
  each_scene_requires:
    - "scene number"
    - "scene title"
    - "scene information"
    - "image filename"
    - "voiceover audio"
    - "text on screen"
    - "motion"
    - "music/sound bed"
    - "transition"

omitted:
  anthropic_api: true
  reason: "Not needed for this production path."
```
