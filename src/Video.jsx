import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { KenBurns } from './components/KenBurns';
import { TextOverlay } from './components/TextOverlay';
import { ScriptureScene } from './components/ScriptureScene';
import { ClosingScene } from './components/ClosingScene';
import { SCENES, FPS } from './scenes';

export const SephardicVideo = ({ platform = 'youtube' }) => {
  const { fps } = useVideoConfig();

  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SCENES.map((scene) => {
        const durationInFrames = scene.durationInSeconds * fps;
        const from = offset;
        offset += durationInFrames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            {/* Voiceover audio for this scene */}
            {scene.narration && (
              <Audio src={staticFile(`audio/${scene.audio}`)} />
            )}

            {/* Scene content */}
            {scene.type === 'scripture' && (
              <ScriptureScene
                scripture={scene.scripture}
                image={scene.image}
                platform={platform}
              />
            )}

            {scene.type === 'scene' && (
              <AbsoluteFill>
                <KenBurns
                  src={scene.image}
                  direction={SCENES.indexOf(scene) % 2 === 0 ? 'right' : 'left'}
                />
                <TextOverlay lines={scene.lines} platform={platform} />
              </AbsoluteFill>
            )}

            {scene.type === 'closing' && (
              <ClosingScene
                lines={scene.lines}
                image={scene.image}
                platform={platform}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
