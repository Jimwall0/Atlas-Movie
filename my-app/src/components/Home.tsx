import Logout from "./Logout";
import MovieView from "./MovieView";
export default function Home() {
    return (
        <div>
            <h1>Homepage</h1>
            <MovieView/>
            <Logout/>
        </div>
    )
}