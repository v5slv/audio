import s from "./App.module.scss";
import Canvas from "./components/canvas/Canvas";
import Picker from "./components/picker/Picker";
import Search from "./components/search/Search";
import Song from "./components/song/Song";
import useCustomStore from "./customStore";

function App() {
    const songs = useCustomStore((state) => state.songs);

    return (
        <div>
            <h1>yo</h1>
            <div className={s.songs}>
                {songs.map((song) => (
                    <Song key={song.id} data={song} />
                ))}
            </div>
            <Canvas />
            <Search />
            <Picker />
        </div>
    );
}

export default App;
