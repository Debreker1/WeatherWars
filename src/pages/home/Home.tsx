import * as React from 'react';

type Props = {};
type State = {};

class Home extends React.Component<Props, State>
{

    public render()
    {
        return(
            <div>
                <h1>Home</h1>
                <p>De beste en meest betrouwbare applicatie voor het wedden op het weer</p>
                <p>Bepaal zelf je weddenschap of doe mee met een actieve weddenschap</p>
                <img src="https://cdn.24.co.za/files/Cms/General/d/5731/803a771e26d24ad9a644f9fd8e2cb5b9.jpg"></img>
            </div>
        )
    }
}
  
  export default Home;