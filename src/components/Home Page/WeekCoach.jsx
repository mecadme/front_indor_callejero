import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/WeekCoach.css";
import useWeekAward from '../../hooks/useWeekAward'; // Asegúrate de que esta ruta sea correcta

const WeekCoach = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);

  if (isLoading) {
    return <div>Cargando técnico...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Extraer el técnico (ethicOfficer) desde la respuesta de weekAward
  const tecnico = weekAward?.ethicOfficer;

  if (!tecnico) {
    return <div className="alert alert-info">No hay técnico disponible</div>;
  }

  return (
    <div className="week-coach container">
      <h2 className="text-center mb-4">Técnico de la Fecha</h2>
      <div className="row_coach">
        <div className="col-6 col-md-4 col-lg-3 mb-4">
          <div className="card text-center">
            {/* Mostrar imagen del técnico */}
            <img src={tecnico.ethicOfficerPhotoUrl} alt={tecnico.ethicOfficerName} className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">{tecnico.ethicOfficerName}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCoach;
