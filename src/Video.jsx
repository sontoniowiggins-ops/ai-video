import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { KenBurns } from './components/KenBurns';
import { TextOverlay } from './components/TextOverlay';
import { ScriptureScene } from './components/ScriptureScene';
import { ColorGrade } from './components/ColorGrade';
import { TitleCard } from './components/TitleCard';
import { SCENES } from './scenes';

// Cinematic scene backgrounds — no images needed
import { JerusalemScene } from './components/scenes/JerusalemScene';
import { SpainScene } from './components/scenes/SpainScene';
import { WestAfricaScene } from './components/scenes/WestAfricaScene';
import { MapsScene } from './components/scenes/MapsScene';
import { SlaveryScene } from './components/scenes/SlaveryScene';
import { DeuteronomyScene } from './components/scenes/DeuteronomyScene';
import { AmericasScene } from './components/scenes/AmericasScene';
import { ScrollScene } from './components/scenes/ScrollScene';

// Maps each scene ID to its visual component
const SCENE_VISUALS = {
  'scroll-prophecy':   ScrollScene,
  'deuteronomy-warning': DeuteronomyScene,
  'jerusalem-70ad':    JerusalemScene,
  'spain-portugal':    SpainScene,
  'west-africa':       WestAfricaScene,
  'maps':              MapsScene,
  'slavery-prophecy':  SlaveryScene,
  'americas':          AmericasScene,
};

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

              {/* Opening prophecy scroll — uses ScriptureScene for text layout + ScrollScene for background */}
              {scene.type === 'scripture' && (
                <AbsoluteFill>
                  <ScrollScene />
                  <ScriptureScene
                    scripture={scene.scripture}
                    image={null}
                    platform={platform}
                  />
                </AbsoluteFill>
              )}

              {/* Standard scene — cinematic procedural background + text overlay */}
              {scene.type === 'scene' && (() => {
                const SceneBackground = SCENE_VISUALS[scene.id];
                return (
                  <AbsoluteFill>
                    {SceneBackground
                      ? <SceneBackground />
                      : <KenBurns
                          src={scene.image}
                          direction={i % 2 === 0 ? 'right' : 'left'}
                          startScale={scene.id === 'maps' ? 1.0 : 1.0}
                          endScale={scene.id === 'maps' ? 1.08 : 1.12}
                        />
                    }
                    <TextOverlay lines={scene.lines} platform={platform} />
                  </AbsoluteFill>
                );
              })()}

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
