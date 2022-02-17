import {ActionsModel} from '../../models/actions-model';

export const SettingsActions: ActionsModel[] = [
    {
        name: 'penwidth',
        about: 'set pen width to W (in pixels)',
        regex: '([0-9]+)'
    },
    {
        name: 'pencolor',
        about: 'set pen color to R, G, B',
        regex: '([0-9]+)\ ([0-9]+)\ ([0-9]+)'
    },
    {
        name: 'penspeed',
        about: 'set animation speed',
        regex: '([0-9]+)'
    }
]

export const ConsoleActions: ActionsModel[] = [
    {
        name: 'penup',
        about: 'enable drawing'
    },
    {
        name: 'pendown',
        about: 'disable drawing'
    },
    {
        name: 'forward',
        about: 'go forward and draw a line along the path if the pen is down',
        regex: '([0-9]+)'
    },
    {
        name: 'backward',
        about: 'go backward and draw a line along the path if the pen is down',
        regex: '([0-9]+)'
    },
    {
        name: 'turnleft',
        about: 'turn left by D degrees',
        regex: '([0-9]+)'
    },
    {
        name: 'turnright',
        about: 'turn right by D degrees',
        regex: '([0-9]+)'
    },
    {
        name: 'direction',
        about: 'set turtle in a specific direction by D being degrees and 0 degrees being up',
        regex: '([0-9]+)'
    },
    {
        name: 'center',
        about: 'move turtle to the center **without** drawing anything'
    },
    {
        name: 'gox',
        about: 'move turtle on the X axis to position X **without** drawing anything',
        regex: '([-+]?[0-9]+)'
    },
    {
        name: 'goy',
        about: 'move turtle on the X axis to position X **without** drawing anything',
        regex: '([-+]?[0-9]+)'
    },
    {
        name: 'go',
        about: 'move turtle to the center **without** drawing anything',
        regex: '([-+]?[0-9]+)\ ([-+]?[0-9]+)'
    }
]

export const AvailableActions: ActionsModel[] = [
    ...SettingsActions,
    ...ConsoleActions
]
