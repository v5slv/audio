import s from "./Song.module.scss";
import AudioController from "../../utils/AudioController";
import Scene from "../../webgl/Scene";

const Song = ({ data }) => {
    const pickSong = () => {
        AudioController.updateSong(data.preview);
        Scene.cover.updateCover(data.album.cover_xl);
    };
    return (
        <div
            className={s.song}
            // onClick={() => AudioController.updateSong(data.preview)}
            onClick={pickSong}
        >
            <img src={data.album.cover_small} alt="" className={s.img} />
            <span className={s.title}>{data.title}</span>
        </div>
    );
};

export default Song;
