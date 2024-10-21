import styles from './App.module.css';
import Counter from './Counter';
import Counter2 from './Counter2';
import Dynamo from './Dynamo';
import Flow from './Flow';
import Login from './Login';
import Menu from './Menu';
import MyComponent from './MyComponent';
import Events from './Events';
import Styles from './Styles';
import Refs from './Refs';
import Spreads from './Spreads';
import Pvp from './Pvp';
import Children from './Children';
import Forms from './Forms';

export default function App() {
  return (
    <>
      <div class={styles.App}>Dobar dan, svijete!</div>
      <Forms />
    </>
  );
}