'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const DagAgenda = () => {
  // State beheer
  const [huidigeDatum, setHuidigeDatum] = useState(new Date(2025, 0, 1));
  const [taken, setTaken] = useState({});
  const [geselecteerdeDatum, setGeselecteerdeDatum] = useState(null);
  const [nieuweTaak, setNieuweTaak] = useState({
    titel: '',
    persoon: '',
    kleur: 'bg-green-500' // Standaard kleur voor taak
  });

  // Hulpfunctie om dagen in een maand te bepalen
  const getDagenInMaand = (jaar, maand) => {
    return new Date(jaar, maand + 1, 0).getDate();
  };

  // Genereer kalenderrooster
  const genereeerKalenderRooster = () => {
    const jaar = huidigeDatum.getFullYear();
    const maand = huidigeDatum.getMonth();
    const dagenInMaand = getDagenInMaand(jaar, maand);
    const eersteWeekdagVanMaand = new Date(jaar, maand, 1).getDay();

    const rooster = [];
    let dagenTeller = 1;

    // Maak 6 rijen om alle mogelijke maandindelingen te ondersteunen
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < eersteWeekdagVanMaand) {
          // Dagen van vorige maand (lege cellen)
          week.push(null);
        } else if (dagenTeller > dagenInMaand) {
          // Dagen van volgende maand (lege cellen)
          week.push(null);
        } else {
          const huidigeDag = new Date(jaar, maand, dagenTeller);
          const datumSleutel = huidigeDag.toISOString().split('T')[0];
          week.push({
            datum: huidigeDag,
            dag: dagenTeller,
            taak: taken[datumSleutel] || []
          });
          dagenTeller++;
        }
      }
      rooster.push(week);
      // Stop als we alle dagen van de maand hebben gevuld
      if (dagenTeller > dagenInMaand) break;
    }

    return rooster;
  };

  // Behandel datumselectie
  const behandelDatumKlik = (datum) => {
    if (datum) {
      setGeselecteerdeDatum(datum.datum);
      setNieuweTaak({
        titel: datum.taak?.titel || '',
        persoon: datum.taak?.persoon || '',
        kleur: datum.taak?.kleur || 'bg-green-500'
      });
    }
  };

  // Voeg taak toe of werk deze bij
  const behandelTaakToevoegen = () => {
    if (geselecteerdeDatum && (nieuweTaak.titel || nieuweTaak.persoon)) {
      const datumSleutel = geselecteerdeDatum.toISOString().split('T')[0];
      const bijgewerkteTaken = {
        ...taken,
        [datumSleutel]: [
          ...taken[datumSleutel] || [],
          {
            titel: nieuweTaak.titel,
            persoon: nieuweTaak.persoon,
            kleur: nieuweTaak.kleur
          }
        ]
      };
      setTaken(bijgewerkteTaken);
    }
  };

  // Maandnavigatie
  const wijzigMaand = (richting) => {
    const nieuweDatum = new Date(huidigeDatum);
    nieuweDatum.setMonth(nieuweDatum.getMonth() + richting);
    setHuidigeDatum(nieuweDatum);
  };

  // Maanden array voor weergave
  const maanden = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ];

  // Weekdag headers
  const weekdagen = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

  // Kleur opties voor de taken (sterk contrasterende kleuren)
  const kleuren = [
    'bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-orange-500', 'bg-gray-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500', 'bg-lime-500', 'bg-emerald-500',
    'bg-cyan-500', 'bg-violet-500', 'bg-rose-500'
  ];

  return (
    <Card className="w-full max-w-full mx-auto bg-gray-100">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center w-full">
            {/* Voeg hier je afbeelding toe aan de linkerkant */}
            <div className="mr-4">
              <img 
                src="https://www.ieper.be/files/uploads/imagecache/nexOrganisationPhoto/organisation/afbeelding1.jpg" 
                alt="Logo" 
                className="w-20 h-20 object-cover rounded-full" 
              />
            </div>

            {/* Maand navigatie met vaste breedte voor de pijltjes */}
            <div className="flex justify-between items-center w-full">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => wijzigMaand(-1)} 
                className="w-16"
              >
                <ChevronLeft />
              </Button>
              <span className="mx-4 text-xl font-bold">
                {maanden[huidigeDatum.getMonth()]} {huidigeDatum.getFullYear()}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => wijzigMaand(1)} 
                className="w-16"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex space-x-4">
        {/* Kalenderrooster */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-4">
            {weekdagen.map(dag => (
              <div key={dag} className="font-bold text-center text-lg">
                {dag}
              </div>
            ))}
            {genereeerKalenderRooster().map((week, weekIndex) => (
              week.map((dag, dagIndex) => (
                <div 
                  key={`${weekIndex}-${dagIndex}`} 
                  className={`border p-6 min-h-[180px] relative ${
                    dag ? 'cursor-pointer hover:bg-blue-200' : 'bg-gray-400'
                  }`}
                  onClick={() => dag && behandelDatumKlik(dag)}
                >
                  {dag && (
                    <>
                      <div className="text-xl font-semibold mb-2">
                        {dag.dag}
                      </div>
                      {dag.taak && dag.taak.map((taak, index) => (
                        <div key={index} className={`p-2 rounded text-sm ${taak.kleur}`}>
                          <div>{taak.persoon} - {taak.titel}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Taak Invoer Paneel naast de kalender */}
        <div className="w-96 p-6 border rounded-lg shadow-xl bg-white">
          {geselecteerdeDatum && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Taak toevoegen voor {geselecteerdeDatum.toLocaleDateString()}
              </h2>
              <Input 
                placeholder="Vrijwilliger" 
                value={nieuweTaak.persoon}
                onChange={(e) => setNieuweTaak({...nieuweTaak, persoon: e.target.value})}
                className="mb-4 text-lg"
              />
              <Input 
                placeholder="Taak" 
                value={nieuweTaak.titel}
                onChange={(e) => setNieuweTaak({...nieuweTaak, titel: e.target.value})}
                className="mb-4 text-lg"
              />
              {/* Kleur kiezen */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                {kleuren.map((kleur, index) => (
                  <div
                    key={index}
                    onClick={() => setNieuweTaak({...nieuweTaak, kleur})}
                    className={`w-12 h-12 rounded-lg cursor-pointer ${kleur}`}
                  />
                ))}
              </div>
              <Button 
                onClick={behandelTaakToevoegen} 
                className="w-full bg-blue-500 text-white font-bold text-lg py-3"
              >
                Taak Toevoegen
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DagAgenda;
