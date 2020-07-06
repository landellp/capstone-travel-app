import { handleSubmit, handleSave, fetchTrips } from "./js/app";

// import styles
import "./styles/style.scss";

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', fetchTrips);
    const form = document.getElementById('travelForm');
    form.addEventListener('submit', handleSubmit);
    document.getElementById('buttonSave').addEventListener('click', handleSave);
});
