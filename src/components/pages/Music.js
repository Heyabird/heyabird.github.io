import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';

export const Music = () => (
  <>
    <div className="page-header">
      <h1>Music & Video</h1>  
    </div>
    <div className="page-content">
      <h4>Page Under Construction!</h4><h4>
          For now, check out my music here: <br/> <br/>
          <Button href="https://www.youtube.com/results?search_query=heya+%E3%85%8E%E3%85%87" target="_blank"><i class="fab fa-youtube"></i>Youtube</Button> 
          <Button href="https://soundcloud.com/heyaworld" target="_blank"><i class="fab fa-soundcloud"></i>Soundcloud</Button> 
          <Button href="https://open.spotify.com/artist/00RTzPyOnRKHjxlfR8f4AB" target="_blank"><i class="fab fa-spotify"></i>Spotify</Button> 
          <Button href="https://music.apple.com/us/artist/heya-%E3%85%8E%E3%85%87/1390275253" target="_blank"><i class="fab fa-apple"></i>Apple Music</Button>
          <Button href="https://heyaworld.bandcamp.com/" target="_blank"><i class="fab fa-bandcamp"></i>Bandcamp</Button>  
      </h4>
        <div id="heya-cartoon">
          <img src="/heya_construction_outside.svg" onMouseOver={e => (e.currentTarget.src = "/heya_construction_inside.svg")} onMouseOut={e => (e.currentTarget.src = "/heya_construction_outside.svg")}/>
      </div>
    </div>
  </>
)