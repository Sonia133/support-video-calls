import copy
import time


def elem_identice(lista):
    """ Primeste o lista si returneaza
    -> simbolul jucatorului castigator (daca lista contine doar acel simbol repetat)
    -> sau False (daca a fost remiza sau daca nu s-a terminat jocul)
    """
    mt = set(lista)
    if len(mt) == 1:
        castigator = list(mt)[0]
        if castigator != Joc.GOL:
            return castigator
        else:
            return False
    else:
        return False

def gaseste_trei(lista):
    x, o = 0, 0
    for i in range(len(lista)):
        if lista[i] == Joc.SIMBOLURI_JUC[0]:
            x += 1
        elif lista[i] == Joc.SIMBOLURI_JUC[1]:
            o += 1

    if o == 3:
        return Joc.SIMBOLURI_JUC[1]
    elif x == 3:
        return Joc.SIMBOLURI_JUC[0]
    else:
        return False


class Joc:
    """
    Clasa care defineste jocul. Se va schimba de la un joc la altul.
    """
    NR_COLOANE = 7
    NR_LINII = 6
    NR_CONNECT = 4  # cu cate simboluri adiacente se castiga
    SIMBOLURI_JUC = ['X', '0']  # ['G', 'R'] sau ['X', '0']
    JMIN = None  # 'R'
    JMAX = None  # 'G'
    GOL = '.'

    def __init__(self, tabla=None):
        self.matr = tabla or [Joc.GOL] * (Joc.NR_COLOANE * Joc.NR_LINII)

    def intermediar(self):
        rez = False

        for i in range(self.NR_LINII):
            for j in range(self.NR_COLOANE - self.NR_CONNECT + 1):
                rez = gaseste_trei(self.matr[i * self.NR_COLOANE + j: i * self.NR_COLOANE + j + self.NR_CONNECT])

        if (rez):
            for i in range(self.NR_COLOANE):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = gaseste_trei(self.matr[
                                        j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE])

        if (rez):
            for i in range(self.NR_COLOANE - self.NR_CONNECT + 1):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = gaseste_trei(self.matr[
                                        j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE + 1])

        if (rez):
            for i in range(self.NR_COLOANE - 1, self.NR_COLOANE - self.NR_CONNECT, -1):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = gaseste_trei(self.matr[j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * (
                                self.NR_COLOANE - 1): self.NR_COLOANE - 1])

        if (rez):
            return rez

        if rez == False:
            return False

    def final(self):
        # returnam simbolul jucatorului castigator daca are 4 piese adiacente
        #	pe linie, coloana, diagonala \ sau diagonala /
        # sau returnam 'remiza'
        # sau 'False' daca nu s-a terminat jocul
        rez = False

        for i in range(self.NR_LINII):
            for j in range(self.NR_COLOANE - self.NR_CONNECT + 1):
                rez = elem_identice(self.matr[i * self.NR_COLOANE + j: i * self.NR_COLOANE + j + self.NR_CONNECT])

        if (rez):
            for i in range(self.NR_COLOANE):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = elem_identice(self.matr[
                                        j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE])

        if (rez):
            for i in range(self.NR_COLOANE - self.NR_CONNECT + 1):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = elem_identice(self.matr[
                                        j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE + 1])

        if (rez):
            for i in range(self.NR_COLOANE - 1, self.NR_COLOANE - self.NR_CONNECT, -1):
                for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                    rez = elem_identice(self.matr[j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * (
                                self.NR_COLOANE - 1): self.NR_COLOANE - 1])

        if (rez):
            return rez

        if rez == False and Joc.GOL not in self.matr:
            return 'remiza'
        else:
            return False

    def mutari(self, jucator):
        l_mutari = []
        for i in range(Joc.NR_COLOANE):
            for j in range(Joc.NR_LINII - 1, -1, -1):
                if self.matr[j * Joc.NR_COLOANE + i] == Joc.GOL:
                    mutare = copy.deepcopy(self)
                    mutare.matr[j * Joc.NR_COLOANE + i] = jucator
                    l_mutari.append(mutare)
                    break

        return l_mutari

    def nr_intervale_deschise(self, jucator):
        # un interval de 4 pozitii adiacente (pe linie, coloana, diag \ sau diag /)
        # este deschis pt "jucator" daca nu contine "juc_opus"

        rez = 0

        for i in range(self.NR_LINII):
            for j in range(self.NR_COLOANE - self.NR_CONNECT + 1):
                verific = set(self.matr[i * self.NR_COLOANE + j: i * self.NR_COLOANE + j + self.NR_CONNECT])
                if len(verific) <= 2:
                    if verific <= {Joc.GOL, jucator}:
                        rez += 1

        for i in range(self.NR_COLOANE):
            for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                verific = set(self.matr[j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE])
                if len(verific) <= 2:
                    if verific <= {Joc.GOL, jucator}:
                        rez += 1

        for i in range(self.NR_COLOANE - self.NR_CONNECT + 1):
            for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                verific = set(self.matr[j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * self.NR_COLOANE: self.NR_COLOANE + 1])
                if len(verific) <= 2:
                    if verific <= {Joc.GOL, jucator}:
                        rez += 1

        for i in range(self.NR_COLOANE - 1, self.NR_COLOANE - self.NR_CONNECT, -1):
            for j in range(self.NR_LINII - self.NR_CONNECT + 1):
                verific = set(self.matr[j * self.NR_COLOANE + i: j * self.NR_COLOANE + i + self.NR_CONNECT * (
                            self.NR_COLOANE - 1): self.NR_COLOANE - 1])
                if len(verific) <= 2:
                    if verific <= {Joc.GOL, jucator}:
                        rez += 1

        return rez

    def fct_euristica(self):
        player = self.nr_intervale_deschise(Joc.JMAX)
        opponent = self.nr_intervale_deschise(Joc.JMIN)

        if player == opponent:
            if opponent == Joc.SIMBOLURI_JUC[0]:
                return -1
            else:
                return 0.3
        else:
            return self.nr_intervale_deschise(Joc.JMAX) - self.nr_intervale_deschise(Joc.JMIN)

    def estimeaza_scor(self, adancime):
        t_final = self.final()
        if t_final == Joc.JMAX:
            return (999 + adancime)
        elif t_final == Joc.JMIN:
            return (-999 - adancime)
        elif t_final == 'remiza':
            return 0
        else:
            t_intermediar = self.intermediar()
            if t_intermediar == Joc.JMAX:
                return (799 + adancime)
            elif t_intermediar == Joc.JMIN:
                return (-799 - adancime)
            else:
                return self.fct_euristica()

    def __str__(self):
        sir = ''
        for nr_col in range(self.NR_COLOANE):
            sir += str(nr_col + 1) + ' '
        sir += '\n'

        for lin in range(self.NR_LINII):
            k = lin * self.NR_COLOANE
            sir += (" ".join([str(x) for x in self.matr[k: k + self.NR_COLOANE]]) + "\n")
        return sir


class Stare:
    """
    Clasa folosita de algoritmii minimax si alpha-beta
    Are ca proprietate tabla de joc
    Functioneaza cu conditia ca in cadrul clasei Joc sa fie definiti JMIN si JMAX (cei doi jucatori posibili)
    De asemenea cere ca in clasa Joc sa fie definita si o metoda numita mutari() care ofera lista cu
    configuratiile posibile in urma mutarii unui jucator
    """

    ADANCIME_MAX = None

    def __init__(self, tabla_joc, j_curent, adancime, parinte=None, scor=None):
        self.tabla_joc = tabla_joc
        self.j_curent = j_curent

        # adancimea in arborele de stari
        self.adancime = adancime

        # scorul starii (daca e finala) sau al celei mai bune stari-fiice (pentru jucatorul curent)
        self.scor = scor

        # lista de mutari posibile din starea curenta
        self.mutari_posibile = []

        # cea mai buna mutare din lista de mutari posibile pentru jucatorul curent
        self.stare_aleasa = None

    def jucator_opus(self):
        if self.j_curent == Joc.JMIN:
            return Joc.JMAX
        else:
            return Joc.JMIN

    def mutari(self):
        l_mutari = self.tabla_joc.mutari(self.j_curent)
        juc_opus = self.jucator_opus()
        l_stari_mutari = [Stare(mutare, juc_opus, self.adancime - 1, parinte=self) for mutare in l_mutari]

        return l_stari_mutari

    def __str__(self):
        sir = str(self.tabla_joc) + "(Juc curent: " + self.j_curent + ")\n"
        return sir


def alpha_beta(alpha, beta, stare):
    if stare.adancime == 0 or stare.tabla_joc.final():
        stare.scor = stare.tabla_joc.estimeaza_scor(stare.adancime)
        return stare

    if alpha >= beta:
        return stare  # este intr-un interval invalid deci nu o mai procesez

    stare.mutari_posibile = stare.mutari()

    if stare.j_curent == Joc.JMAX:
        scor_curent = float('-inf')

        for mutare in stare.mutari_posibile:
            # calculeaza scorul
            stare_noua = alpha_beta(alpha, beta, mutare)

            if (scor_curent < stare_noua.scor):
                stare.stare_aleasa = stare_noua
                scor_curent = stare_noua.scor
            if (alpha < stare_noua.scor):
                alpha = stare_noua.scor
                if alpha >= beta:
                    break

    elif stare.j_curent == Joc.JMIN:
        scor_curent = float('inf')

        for mutare in stare.mutari_posibile:
            stare_noua = alpha_beta(alpha, beta, mutare)

            if (scor_curent > stare_noua.scor):
                stare.stare_aleasa = stare_noua
                scor_curent = stare_noua.scor

            if (beta > stare_noua.scor):
                beta = stare_noua.scor
                if alpha >= beta:
                    break

    stare.scor = stare.stare_aleasa.scor

    return stare


def afis_daca_final(stare_curenta, pozitie):

    tabla_noua = stare_curenta.tabla_joc.matr

    linie = pozitie // Joc.NR_COLOANE
    coloana = pozitie - (linie * Joc.NR_COLOANE)

    # sus
    if linie - (Joc.NR_CONNECT - 1) >= 0:
        rez = elem_identice(tabla_noua[pozitie - (Joc.NR_COLOANE * (Joc.NR_CONNECT - 1)):pozitie + 1:Joc.NR_COLOANE])
        if rez:
            print(1)
            print("A castigat " + rez)
            return True

    # sus dreapta
    if linie - (Joc.NR_CONNECT - 1) >= 0 and coloana + (Joc.NR_CONNECT - 1) < Joc.NR_COLOANE:
        rez = elem_identice(
            tabla_noua[pozitie - ((Joc.NR_COLOANE - 1) * (Joc.NR_CONNECT - 1)):pozitie + 1:Joc.NR_COLOANE - 1])
        if rez:
            print(2)
            print("A castigat " + rez)
            return True

    # dreapta
    if coloana + (Joc.NR_CONNECT - 1) < Joc.NR_COLOANE:
        rez = elem_identice(tabla_noua[pozitie:pozitie + 4])
        if rez:
            print(3)
            print("A castigat " + rez)
            return True

    # dreapta jos
    if coloana + (Joc.NR_CONNECT - 1) < Joc.NR_COLOANE and linie + (Joc.NR_CONNECT - 1) < Joc.NR_LINII:
        rez = elem_identice(
            tabla_noua[pozitie:pozitie + ((Joc.NR_COLOANE + 1) * (Joc.NR_CONNECT - 1)) + 1:Joc.NR_COLOANE + 1])
        if rez:
            print(4)
            print("A castigat " + rez)
            return True

    # jos
    if linie + (Joc.NR_CONNECT - 1) < Joc.NR_LINII:
        rez = elem_identice(tabla_noua[pozitie:pozitie + (Joc.NR_COLOANE * (Joc.NR_CONNECT - 1)) + 1:Joc.NR_COLOANE])
        if rez:
            print(5)
            print("A castigat " + rez)
            return True

    # jos stanga
    if (pozitie == 10 or pozitie == 17 or pozitie == 3):
            print(tabla_noua[pozitie:pozitie + ((Joc.NR_COLOANE - 1) * (Joc.NR_CONNECT - 1)) + 1:Joc.NR_COLOANE - 1])
    
    if linie + (Joc.NR_CONNECT - 1) < Joc.NR_LINII and coloana >= (Joc.NR_CONNECT - 1):
        rez = elem_identice(
            tabla_noua[pozitie:pozitie + ((Joc.NR_COLOANE - 1) * (Joc.NR_CONNECT - 1)) + 1:Joc.NR_COLOANE - 1])
        if rez:
            print(6)
            print("A castigat " + rez)
            return True

    # stanga
    if coloana >= (Joc.NR_CONNECT - 1):
        print(tabla_noua[pozitie - 3:pozitie + 1])
        print(pozitie)
        rez = elem_identice(tabla_noua[pozitie - 3:pozitie + 1])
        if rez:
            print(7)
            print("A castigat " + rez)
            return True

    # stanga sus
    
    if coloana - (Joc.NR_COLOANE - 1) >= 0 and linie - (Joc.NR_CONNECT - 1) >= 0:
        if (pozitie == 10 or pozitie == 17 or pozitie == 3):
            print(tabla_noua[pozitie - ((Joc.NR_COLOANE + 1) * (Joc.NR_CONNECT - 1)):pozitie + 1:Joc.NR_COLOANE + 1])
        
        rez = elem_identice(
            tabla_noua[pozitie - ((Joc.NR_COLOANE + 1) * (Joc.NR_CONNECT - 1)):pozitie + 1:Joc.NR_COLOANE + 1])
        if rez:
            print(8)
            print("A castigat " + rez)
            return True

    if Joc.GOL not in tabla_noua:
        print("Remiza")
        return True

    return False


def main():
    # initializare algoritm
    raspuns_valid = False
    Stare.ADANCIME_MAX = 5

    [s1, s2] = Joc.SIMBOLURI_JUC.copy()  # lista de simboluri posibile
    while not raspuns_valid:
        Joc.JMIN = str(input("Doriti sa jucati cu {} sau cu {}? ".format(s1, s2))).upper()
        if (Joc.JMIN in Joc.SIMBOLURI_JUC):
            raspuns_valid = True
        else:
            print("Raspunsul trebuie sa fie {} sau {}.".format(s1, s2))
    Joc.JMAX = s1 if Joc.JMIN == s2 else s2

    # initializare tabla
    tabla_curenta = Joc()
    print("Tabla initiala")
    print(str(tabla_curenta))

    # creare stare initiala
    stare_curenta = Stare(tabla_curenta, Joc.SIMBOLURI_JUC[0], Stare.ADANCIME_MAX)

    linie = -1
    coloana = -1
    while True:
        if (stare_curenta.j_curent == Joc.JMIN):
            # muta jucatorul
            raspuns_valid = False
            while not raspuns_valid:
                try:
                    coloana = int(input("coloana = "))
                    coloana = coloana - 1

                    if coloana in range(0, Joc.NR_COLOANE):
                        valid = False
                        for i in range(Joc.NR_LINII - 1, -1, -1):
                            if stare_curenta.tabla_joc.matr[i * Joc.NR_COLOANE + coloana] == Joc.GOL:
                                linie = i
                                valid = True
                                break
                        if valid == False:
                            print("Toata coloana este ocupata.")
                        else:
                            raspuns_valid = True
                    else:
                        print("Coloana invalida (trebuie sa fie un numar intre 0 si {}).".format(Joc.NR_COLOANE - 1))

                except ValueError:
                    print("Coloana trebuie sa fie un numar intreg.")

            # dupa iesirea din while sigur am valida coloana
            # deci pot plasa simbolul pe "tabla de joc"
            pozitie = linie * Joc.NR_COLOANE + coloana
            stare_curenta.tabla_joc.matr[pozitie] = Joc.JMIN

            # afisarea starii jocului in urma mutarii utilizatorului
            print("\nTabla dupa mutarea jucatorului")
            print(str(stare_curenta))

            # testez daca jocul a ajuns intr-o stare finala
            # si afisez un mesaj corespunzator in caz ca da
            if (afis_daca_final(stare_curenta, pozitie)):
                break

            # S-a realizat o mutare. Schimb jucatorul cu cel opus
            stare_curenta.j_curent = stare_curenta.jucator_opus()

        # --------------------------------
        else:  # jucatorul e JMAX (calculatorul)
            # Mutare calculator

            stare_actualizata = alpha_beta(-5000, 5000, stare_curenta)
            for i in range(Joc.NR_LINII * Joc.NR_COLOANE):
                if stare_curenta.tabla_joc.matr[i] != stare_actualizata.stare_aleasa.tabla_joc.matr[i]:
                    pozitie = i
                    break

            stare_curenta.tabla_joc = stare_actualizata.stare_aleasa.tabla_joc
            print("Tabla dupa mutarea calculatorului")
            print(str(stare_curenta))
            print(stare_curenta.scor)

            if (afis_daca_final(stare_curenta, pozitie)):
                break

            # S-a realizat o mutare. Schimb jucatorul cu cel opus
            stare_curenta.j_curent = stare_curenta.jucator_opus()


if __name__ == "__main__":
    main()
