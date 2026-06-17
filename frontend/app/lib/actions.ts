const ESTADOS_CURP: Record<string, string> = {
    "AS": "Aguascalientes", "BC": "Baja California", "BS": "Baja California Sur",
    "CC": "Campeche", "CL": "Coahuila", "CM": "Colima", "CS": "Chiapas",
    "CH": "Chihuahua", "DF": "Ciudad de México", "DG": "Durango",
    "GT": "Guanajuato", "GR": "Guerrero", "HG": "Hidalgo", "JC": "Jalisco",
    "MC": "Estado de México", "MN": "Michoacán", "MS": "Morelos",
    "NT": "Nayarit", "NL": "Nuevo León", "OC": "Oaxaca", "PL": "Puebla",
    "QT": "Querétaro", "QR": "Quintana Roo", "SP": "San Luis Potosí",
    "SL": "Sinaloa", "SR": "Sonora", "TC": "Tabasco", "TS": "Tamaulipas",
    "TL": "Tlaxcala", "VZ": "Veracruz", "YN": "Yucatán", "ZS": "Zacatecas",
    "NE": "Nacido en el Extranjero"
};

export const extraerDatosCurp = (curp: string) => {
    if (!curp || curp.length !== 18) return null;

    const curpUpper = curp.toUpperCase();
    const anioStr = curpUpper.substring(4, 6);
    const mesStr = curpUpper.substring(6, 8);
    const diaStr = curpUpper.substring(8, 10);
    const estadoCodigo = curpUpper.substring(11, 13);
    const digitoSiglo = curpUpper.charAt(16);

    let anio = parseInt(anioStr, 10);
    if (isNaN(anio)) return null;

    if (/[A-Z]/.test(digitoSiglo)) {
        anio += 2000;
    } else {
        anio += 1900;
    }

    const fechaNacimiento = `${anio}-${mesStr}-${diaStr}`;
    const estadoOrigen = ESTADOS_CURP[estadoCodigo] || "";

    return { fechaNacimiento, estadoOrigen };
};