export const slkToTable = (
  data: string,
): Array<Array<string | number | boolean>> => {
  if (!data.startsWith("ID")) throw new Error("WrongMagicNumber");

  const rows: Array<Array<string | number | boolean>> = [];
  let x = 0;
  let y = 0;

  // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
  // Therefore, just ignore it, since JavaScript arrays grow as they want either way
  for (const line of data.split("\n")) {
    if (line[0] !== "B") {
      for (const token of line.split(";")) {
        const op = token[0];
        const valueString = token.substring(1).trim();
        let value: string | number | boolean;

        if (op === "X") x = parseInt(valueString, 10) - 1;
        else if (op === "Y") y = parseInt(valueString, 10) - 1;
        else if (op === "K") {
          if (!rows[y]) rows[y] = [];

          if (valueString[0] === '"') {
            value = valueString.substring(
              1,
              valueString.length - 1,
            );
          } else if (valueString === "TRUE") value = true;
          else if (valueString === "FALSE") value = false;
          else value = parseFloat(valueString);

          rows[y][x] = value;
        } /* else if ( op === "A" ) {

					if ( ! this.comments )
						this.comments = [];

					if ( ! this.comments[ y ] )
						this.comments[ y ] = [];

					this.comments[ y ][ x ] = valueString;

				}*/
      }
    }
  }

  return rows;
  // this.cols = this.rows.reduce( ( m, r ) => Math.max( m, r.length ), 0 );
};
