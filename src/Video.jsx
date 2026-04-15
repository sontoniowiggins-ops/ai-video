import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { KenBurns } from './components/KenBurns';
import { TextOverlay } from './components/TextOverlay';
import { ScriptureScene } from './components/ScriptureScene';
import { ColorGrade } from './components/ColorGrade';
import { TitleCard } from './components/TitleCard';
import { SCENES } from './scenes';

export const SephardicVideo = ({ platform = 'youtube' }) => {
  const { fps } = useVideoConfig();
  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SCENES.map((scene, i) => {
        const durationInFrames = scene.durationInSeconds * fps;
        const from = offset;
        offset += durationInFrames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <ColorGrade grade={scene.colorGrade}>

              {/* Voiceover */}
              {scene.audio && (
                <Audio src={staticFile(`audio/${scene.audio}`)} />
              )}

              {/* Opening prophecy scroll */}
              {scene.type === 'scripture' && (
                <ScriptureScene
                  scripture={scene.scripture}
                  image={scene.image}
                  platform={platform}
                />
              )}

              {/* Standard scene — image + text */}
              {scene.type === 'scene' && (
                <AbsoluteFill>
                  <KenBurns
                    src={scene.image}
                    direction={i % 2 === 0 ? 'right' : 'left'}
                    // Maps scene: slower subtle zoom only
                    startScale={scene.id === 'maps' ? 1.0 : 1.0}
                    endScale={scene.id === 'maps' ? 1.08 : 1.12}
                  />
                  <TextOverlay lines={scene.lines} platform={platform} />
                </AbsoluteFill>
              )}

              {/* Final title card */}
              {scene.type === 'title' && (
                <TitleCard title={scene.title} subtitle={scene.subtitle} />
              )}

            </ColorGrade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
