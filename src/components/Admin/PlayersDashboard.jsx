import {useEffect} from 'react'
import {useGetPlayers} from '../../api/Service/PlayerService'

const PlayersDashboard = () => {

    const { data, error, loading, getPlayers } = useGetPlayers();

    useEffect(() => {
      getPlayers(); 
    }, []);

    console.log(data)
  

  return (
    <div>PlayersDashboard</div>
  )
}

export default PlayersDashboard